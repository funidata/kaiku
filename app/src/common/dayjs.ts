import _dayjs from "dayjs";
import "dayjs/locale/fi";
import weekday from "dayjs/plugin/weekday";

const dayjs = _dayjs;

dayjs.locale("fi");
dayjs.extend(weekday);

export default dayjs;
