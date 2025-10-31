import { Button } from "../ui/button";
import { PlusIcon } from "../Icons/plusIcon";
import { ShareIcon } from "../Icons/shareIcon";
import { Card } from "../ui/card";
import { CreateContentModal } from "../ui/createContentModal";
import { useState } from "react";
import { Sidebar } from "../ui/sidebar";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import { BACKEND_URL } from "./backendurl";

export function Dashboard() {

  const [modalOpen, setModalOpen] = useState(false);
  const contents = useContent();


  return (
    <div>
      <div>
        <Sidebar />
      </div>

      <div className=" p-4 ml-96 bg-gray-200 ">
        < CreateContentModal open={modalOpen} onClose={() => {
          setModalOpen(false);
        }} />
        <div className=" flex justify-end gap-4 pt-4 ">
          <Button onClick={() => {
            setModalOpen(true);
          }} startIcon={<PlusIcon />} variant="primary" text=" Add Content " />
          <Button onClick={async () => {
            const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
              share: true
            }, {
                 headers:{
                  "Authorization":localStorage.getItem("token")
                 }
            });
           const shareUrl = `http://localhost:5173/share${response.data.hash}` 
           alert("Your Linke Is Ready to Share: "+shareUrl);
          }} startIcon={<ShareIcon />} variant="secondary" text=" Share Content " />
          
        </div>
        
        <div className=" flex gap-4 pt-20 flex-wrap ">
          {contents.map(({ contentId,type, link, title }) =>
            <Card
              contentId={contentId}
              title={title}
              link={link} type={type}
            ></Card>
          )}

        </div>
      </div>
    </div>
  );
}
