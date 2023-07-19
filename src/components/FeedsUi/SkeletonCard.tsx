import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const SkeletonCard = ({
  direction,
}: {
  direction?: 'vertical' | 'horizontal'
}) => {
  const dummyCard = new Array(5).fill('')
  const dummyParaghrapUnits = ['w-[85%]', 'w-3/4', 'w-80%', 'w-[50%]']

  return (
    <main
      className={`pt-20 ${
        direction === 'horizontal' ? 'px-10 gap-2 grid lg:grid-cols-3' : ''
      }`}
    >
      {dummyCard.map((item, index) => (
        <Card
          key={index + 1}
          className='max-w-[720px] mx-auto w-full my-5 hover:bg-gray-900 transition duration-300'
        >
          <CardHeader>
            <CardTitle>
              <Skeleton className='w-[120px] h-[10px] bg-zinc-700' />
            </CardTitle>
            <div className='text-sm flex gap-2'>
              <Skeleton className='bg-zinc-700 w-[62px] h-[10px]' />
            </div>
          </CardHeader>
          <CardContent className='text-sm relative'>
            <div className='flex flex-col gap-3'>
              {dummyParaghrapUnits.map((unit) => (
                <Skeleton
                  key={unit}
                  className={`${unit} h-[10px] bg-zinc-700`}
                />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className='flex justify-between items-center w-full'>
              <Skeleton className='bg-zinc-700 w-[72px] h-[10px]' />
            </div>
          </CardFooter>
        </Card>
      ))}
    </main>
  )
}

export default SkeletonCard
