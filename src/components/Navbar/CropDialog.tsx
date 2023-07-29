'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from '../ui/alert-dialog'
import { ReactCrop, Crop, PercentCrop, PixelCrop } from 'react-image-crop'
import { centerAspectCrop } from '../utils/cropped/centerAspect'
import { cropImage } from '../utils/cropped/cropImage'
import { RegisteringAssetsType } from './FormSettingProfiles'
import { UseFormResetField } from 'react-hook-form'
import { Button } from '../ui/button'
import 'react-image-crop/dist/ReactCrop.css'
import { useAuth } from '@/context/AuthContext'

interface TPropsCropDialog {
  src: string
  setCropImg: React.Dispatch<React.SetStateAction<File | null>>
  resetField: UseFormResetField<RegisteringAssetsType>
  setImgSrc: React.Dispatch<React.SetStateAction<string>>
}

const CropDialog: React.FC<TPropsCropDialog> = (prop) => {
  const { src, setCropImg, setImgSrc, resetField } = prop
  const imgRef = useRef<HTMLImageElement>(null)
  // const anchorRef = useRef<HTMLAnchorElement>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    height: 300,
    width: 300,
    x: 50,
    y: 50,
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [aspect, setAspect] = useState(1)
  const [closeHelper, setCloseHelper] = useState(false)

  const isOpen = Boolean(src)

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    if (aspect && height < 300) {
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  const startCroppingImage = () => {
    const canvas = document.createElement('canvas')

    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      canvas
    ) {
      // We use canvasPreview as it's much faster than imgPreview.
      cropImage(imgRef.current, canvas, completedCrop)

      canvas.toBlob((blob) => {
        if (blob) {
          const convertToFile = new File([blob!], 'userpf.jpg', {
            type: 'image/jpeg',
          })
          setCropImg(convertToFile)
          setImgSrc('')
        }
      })
    }
  }

  const handleClose = () => {
    setCropImg(null)
    setImgSrc('')
    resetField('file')
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className='bg-slate-950 border-none '>
        <AlertDialogHeader>
          <AlertDialogDescription>
            Crop your profile picture
          </AlertDialogDescription>
        </AlertDialogHeader>
        {!!src && (
          <div className='max-h-[420px] overflow-scroll'>
            <ReactCrop
              crop={crop}
              onChange={(pixelCrop, percentCrop) => setCrop(pixelCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              locked
              circularCrop
            >
              <img
                ref={imgRef}
                src={src}
                alt='crop-preview'
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
        )}
        <AlertDialogFooter className='justify-center'>
          <Button onClick={startCroppingImage}>Set new profile picture</Button>

          <Button variant='destructive' onClick={handleClose}>
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CropDialog
