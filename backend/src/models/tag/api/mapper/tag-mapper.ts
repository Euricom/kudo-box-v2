import { Tag } from "../../entities/tag.entity";
import { TagEvent } from "../dto/TagEvent";

export class TagMapper {
    static toTagEvent(t: Tag): TagEvent {
        return new TagEvent(t.ownerEvent!.id!, t.ownerEvent!.title!, t.name!);
    }
}