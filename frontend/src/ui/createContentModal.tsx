
import { useRef, useState } from "react";
import { CrossIcon } from "../Icons/crossicon";
import { Button } from "./button";
import { Input } from "./input";
import axios from "axios";
import { BACKEND_URL } from "../pages/backendurl";

//@ts-ignore
enum ContentType {
  Youtube = "youtube",
  twitter = "twitter",
  document = "document",
  link = "link",
  linkedIn = "linkedIn"
}


//@ts-ignore
export function CreateContentModal({ open, onClose }) {

  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(ContentType.Youtube);

  async function addcontent() {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    await axios.post(BACKEND_URL + "/api/v1/createContent", {
      title,
      link,
      type
    }, {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    });
    onClose();
  }

  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-black/60 fixed top-0 left-0 flex justify-center items-center">
          <div className="flex flex-col justify-center">
            <span className="bg-white rounded-lg p-4 w-96 shadow-lg">
              <div className="cursor-pointer flex justify-end" onClick={onClose}>
                <CrossIcon />
              </div>
              <div className="flex flex-col gap-2 mt-2 ">
                <Input ref={titleRef} placeholder="Title" />
                <Input ref={linkRef} placeholder="Link" />
                <div className=" flex gap-3 ">
                  <Button onClick={() => { setType(ContentType.Youtube) }} variant="secondary" text="Youtube" />
                  <Button onClick={() => { setType(ContentType.twitter) }} variant="secondary" text="twitter" />
                  <Button onClick={() => { setType(ContentType.linkedIn) }} variant="secondary" text="linkedIn" />
                </div>
                <div className=" flex gap-3 ">
                  <Button onClick={() => { setType(ContentType.document) }} variant="secondary" text="document" />
                  <Button onClick={() => { setType(ContentType.link) }} variant="secondary" text="link" />
                </div>
                <Button onClick={addcontent} variant="primary" text="Add Content" />
              </div>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}