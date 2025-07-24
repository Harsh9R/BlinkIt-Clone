import { Router } from 'express'
import uploadImageController from '../controllers/uploadImage.controller.js'
import upload from '../middleware/multer.js'

const uploadRouter = Router()

uploadRouter.post("/upload", upload.single("image"), uploadImageController)

export default uploadRouter