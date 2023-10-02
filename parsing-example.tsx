import twx from "tailwindcssx";
import { Checkbox } from "professordev-designsystem";
export interface IssueBlockProps {
  id: number;
  title: string;
  username: string;
  timeAndDate: string;
  isChecked: boolean;
  onClickCheckbox: (id: number) => void;
}
export const IssueBlock: React.FC<IssueBlockProps> = ({
  id,
  title = "",
  username = "",
  timeAndDate = "",
  isChecked = false,
  onClickCheckbox,
}) => {
  return (
    <div
      className={twx({
        "": ["border-t border-gray-500", "p-2", "cursor-pointer", "flex"],
        hover: ["bg-gray-100"],
      })}
    >
      <div>
        <Checkbox
          isSelected={isChecked}
          onChange={() => {
            onClickCheckbox(id);
          }}
        />
      </div>
      <div>
        <div
          className={twx({
            "": [
              //"border border-blue-500",
              "font-semibold",
              "text-sm",
              "truncate",
            ],
          })}
        >
          {title}
        </div>
        <div
          className={twx({
            "": [
              //  "border border-green-500",
              "font-thin",
              "text-sm",
              "line-clamp-2",
              "mt-1",
              "ml-1",
            ],
          })}
        >
          Reported at {timeAndDate} by {username}
        </div>
      </div>
    </div>
  );
};
