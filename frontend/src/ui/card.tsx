import axios from "axios";
import { PageIcon } from "../Icons/pageIcon";
import { Button } from "./button";
import { BACKEND_URL } from "../pages/backendurl";

interface CardProps {
    
    contentId?: string;
    type: "youtube" | "twitter" | "linkedIn" | "document" | "link";
    title: string;
    link: string;

}



export function Card(props: CardProps) {

    

    async function removeContent() {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/deleteContent`, {
                data: {
                    contentId: props.contentId,
                },
                  headers:{
                    "Authorization" : localStorage.getItem("token")
                  },
                withCredentials: true,
            });
            alert("Content deleted successfully");
        } catch (err) {
            console.error("Failed to delete content", err);
            alert("Failed to delete content");
        }
    }


    return <div>
        <div className=" p-8 bg-white border-gray-100 rounded-lg border shadow-xl max-w-76 min-h-48 min-w-72 ">
            <div className=" w-full flex  justify-between ">
                <div className=" flex items-center ">
                    <div className=" pr-8 ">
                        <PageIcon />
                    </div>
                    <b>{props.title}</b>
                </div>

                <div className=" flex ">
                    <Button onClick={removeContent} text="delete" variant="secondary" />
                </div>
            </div>

            <div className=" pt-4 " >
                {props.type === "twitter" && <blockquote className=" twitter-tweet w-full pr-4 ">
                    <a href={props.link.replace("x.com", "twitter.com")}></a>
                </blockquote>}

                {props.type === "youtube" && (
                    <iframe className=" w-full "
                        src={props.link.replace("watch", "embed").replace("?v=", "/")}
                        title="YouTube video player" frameBorder="0" allow="accelerometer;
                        autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; 
                        web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
                    </iframe>

                )}

                {props.type === "linkedIn" && (
                    <a
                        href={props.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        View LinkedIn Post
                    </a>
                )}


            </div>


        </div>
    </div>

}