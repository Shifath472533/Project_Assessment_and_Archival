import Card from "@material-tailwind/react/Card";
import CardRow from "@material-tailwind/react/CardRow";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardStatus from "@material-tailwind/react/CardStatus";
import CardStatusFooter from "@material-tailwind/react/CardStatusFooter";
// import Icon from "@material-tailwind/react/Icon";

export default function StatusCard2({
  color,
  icon,
  title,
  amount,
  percentage,
  percentageColor,
  percentageIcon,
  date,
  onClick_,
}) {
  return (
    <div
      className="px-4 mb-10 transform hover:scale-105 transition-transform ease-out duration-300"
      onClick={onClick_}
    >
      <Card className="cursor-pointer">
        <CardRow>
          <CardStatus
            className="mr-2 text-left"
            title={title}
            amount={amount}
          />
          <CardHeader className="w-36" color={color} size="sm" iconOnly>
            {/* <Icon name={icon} size="3xl" color="white" /> */}
            {icon}
          </CardHeader>
        </CardRow>

        <CardStatusFooter className=" border-gray-100 border-t-4"></CardStatusFooter>
      </Card>
    </div>
  );
}
