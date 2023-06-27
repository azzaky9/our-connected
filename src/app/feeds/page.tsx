import PostCard from "@/components/PostCard";

const dummy = [
  {
    name: "azzaky",
    datePost: "08-08-2080",
    titlePost: "some testing",
    contentPost:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi explicabo, dolorum, vero quam atque temporibus distinctio praesentium repudiandae ratione, eum tempore. Consequatur quibusdam amet labore soluta omnis ratione officia tempore?"
  },
  {
    name: "azzaky",
    datePost: "08-08-2080",
    titlePost: "some testing",
    contentPost:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi explicabo, dolorum, vero quam atque temporibus distinctio praesentium repudiandae ratione, eum tempore. Consequatur quibusdam amet labore soluta omnis ratione officia tempore?"
  },
  {
    name: "azzaky",
    datePost: "08-08-2080",
    titlePost: "some testing",
    contentPost:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi explicabo, dolorum, vero quam atque temporibus distinctio praesentium repudiandae ratione, eum tempore. Consequatur quibusdam amet labore soluta omnis ratione officia tempore?"
  },
  {
    name: "azzaky",
    datePost: "08-08-2080",
    titlePost: "some testing",
    contentPost:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi explicabo, dolorum, vero quam atque temporibus distinctio praesentium repudiandae ratione, eum tempore. Consequatur quibusdam amet labore soluta omnis ratione officia tempore?"
  },
  {
    name: "azzaky",
    datePost: "08-08-2080",
    titlePost: "some testing",
    contentPost:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi explicabo, dolorum, vero quam atque temporibus distinctio praesentium repudiandae ratione, eum tempore. Consequatur quibusdam amet labore soluta omnis ratione officia tempore?"
  },
  {
    name: "azzaky",
    datePost: "08-08-2080",
    titlePost: "some testing",
    contentPost:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi explicabo, dolorum, vero quam atque temporibus distinctio praesentium repudiandae ratione, eum tempore. Consequatur quibusdam amet labore soluta omnis ratione officia tempore?"
  }
];

const page = () => {
  return (
    <div className=''>
      <div className='grid place-content-center'>
        {dummy.map((post, index) => (
          <PostCard
            content={post.contentPost}
            title={post.titlePost}
            uploadedName={post.name}
            datePost={post.datePost}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
