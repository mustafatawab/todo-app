import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";


const Task = () => {
  return (
   <div className="w-[80%] mx-auto shadow">
        <div className="flex justify-between items-center p-6 m-5">
          <div className="">
            <div className="flex  ">
              <h1 className="font-bold text-[30px] mb-3  leading-tight">
                Scalable Next.js Folder Structure for Real-World Projects
              </h1>
            </div>
            <div className="flex flex-wrap justify-between">
              <span className="flex   items-center gap-2 my-5">
                <Avatar>
                  <AvatarFallback className="text-white bg-gray-800">
                    I
                  </AvatarFallback>
                </Avatar>
                <p className="text-lg">Imran Khan</p>
              </span>
            <p>2/9/2025</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600 w-3/4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Blanditiis ratione facilis architecto veniam. Explicabo
                voluptatum doloremque exercitationem nulla quisquam libero harum
                perspiciatis repellat distinctio, quidem quia expedita,
                temporibus, omnis voluptate.
              </p>

              <div>
                <button className="text-red-500 px-2 ">
                  <FaTrash size={"19"} />
                </button>
                <button className="text-blue-500  px-2 ">
                  <FaEdit size={"19"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Task