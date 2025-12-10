import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { PostDeleteProps } from "@/lib/types";

export function DeletePostButton({postId}: PostDeleteProps){
    return(
        <Button variant={"destructive"} size={"sm"}>
            <Trash2 className="h-4 w-4 mr-2"/>
            Delete
        </Button>
    )
}