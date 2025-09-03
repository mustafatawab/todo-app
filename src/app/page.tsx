import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";

export default function Home() {
  return (
    <div className="overflow-x-auto m-10">
      <div className=" flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-green-700 text-white px-2 flex items-center">
              <FaPlus /> Add Task
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add ToDo List</AlertDialogTitle>
              <AlertDialogDescription>
                <div>
                  <div>
                    <label className="font-semibold">Title</label>
                    <input
                      className="w-full p-2 border"
                      type="text"
                      placeholder="Title"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mt-3">Description</p>
                    <textarea
                      className="w-full p-2 border"
                      type="text"
                      placeholder="Title"
                    />
                  </div>
                   <div>
                    <p className="font-semibold">Date</p>
                    <input
                      className="w-full p-2 border"
                      type="date"
                      placeholder="Title"
                    />
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Add</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="w-[80%] mx-auto shadow">
        <div className="flex justify-between items-center p-6 m-5">
          <div className="">
            <div className="flex  ">
              <h1 className="font-bold text-[40px] mb-3  leading-tight">
                Scalable Next.js Folder Structure for Real-World Projects
              </h1>
              <div>
                <button className="text-red-500 px-2 ">
                  <FaTrash size={"19"} />
                </button>
                <button className="text-blue-500  px-2 ">
                  <FaEdit size={"19"} />
                </button>
              </div>
            </div>
            <div className="flex   items-center gap-6 my-5">
              <div className=" text-center flex items-center  w-12 h-12 bg-gray-300 rounded-full">
                IM
              </div>
              <p>Imran Khan</p>
              <p>2/9/2025</p>
            </div>
            <p className="text-gray-600 ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis ratione facilis architecto veniam. Explicabo voluptatum
              doloremque exercitationem nulla quisquam libero harum perspiciatis
              repellat distinctio, quidem quia expedita, temporibus, omnis
              voluptate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
