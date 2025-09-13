import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { TaskType } from "@/types/Task";

const Task = ({title, description , tags, createdAt} : TaskType) => {
  return (
    <div className="w-[80%] mx-auto shadow p-6">
      <div className="flex justify-between items-center  m-5 w-full">
        <div className="w-full">
          <div className="flex  justify-between">
            <h1 className="font-bold text-[30px] mb-3  leading-tight">
              {title}
            </h1>
            <span>{createdAt}</span>
          </div>
          {/* <div className="flex flex-wrap justify-between">
            <span className="flex   items-center gap-2 my-5">
              <Avatar>
                <AvatarFallback className="text-white bg-gray-800">
                  I
                </AvatarFallback>
              </Avatar>
              <p className="text-lg">Imran Khan</p>
            </span>
            <p>{createdAt}</p>
          </div> */}
          <div className="flex justify-between w-full">
            <p className="text-gray-600 w-3/4">
              {description}
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
  );
};

export default Task;
