import express from "express"
import fs from "fs"

import { fileURLToPath } from "url" // CORE MODULE
import { dirname, join } from "path" // CORE MODULE

const currentFilePath = fileURLToPath(import.meta.url)

// 2. From the currentPath I can obtain the parent's folder path --> C:\Strive\FullStack\2021\Oct21\M5\strive-m5-d2-oct21\src\services\users
const parentFolderPath = dirname(currentFilePath)

// 3. I can now concatenate that with users.json --> C:\Strive\FullStack\2021\Oct21\M5\strive-m5-d2-oct21\src\services\users\users.json
const usersJSONPath = join(parentFolderPath, "teamlist.json") // please do NOT concatenate paths with the '+' symbol like this parentFolderPath + "users.json"

const InfoRouter = express.Router()

InfoRouter.get("/", (req, res) => {
  //   fs.readFile("your_file.json", "utf8", (err, data) => {
  //     if (err) {
  //       return res.status(500).send(err)
  //     }
  //     res.json(JSON.parse(data))
  //   })

  const fileContent = fs.readFileSync(usersJSONPath) // You obtain a BUFFER object, which is MACHINE READABLE ONLY
  console.log("FILE CONTENT: ", JSON.parse(fileContent))

  // 2. Get back an array from the file
  const usersArray = JSON.parse(fileContent) // JSON.parse converts BUFFER into a real ARRAY

  // 3. Send back the array as a response
  res.send(usersArray)
})

export default InfoRouter
