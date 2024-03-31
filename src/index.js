import { app } from './app.js'
import dotenv from 'dotenv'
import { connectToDB } from './db/index.js'
import swaggerDocs from './utils/swagger.js'
dotenv.config({ path: '../.env' })

let pool;

await connectToDB()
  .then((res) => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`)
      swaggerDocs(app, process.env.PORT)
    })
    pool = res;
  })
  .catch((error) => {
    console.error('Error in starting the server', error)
  })

export { pool }
