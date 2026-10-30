import {
	useSpinnerCircleRecipe,
	useSpinnerOverlayRecipe,
	useSpinnerRecipe,
	useSpinnerTextRecipe,
} from "@styleframe/theme";
import { styleframe } from "virtual:styleframe";

const s = styleframe();

export const spinner = useSpinnerRecipe(s);
export const spinnerCircle = useSpinnerCircleRecipe(s);
export const spinnerText = useSpinnerTextRecipe(s);
export const spinnerOverlay = useSpinnerOverlayRecipe(s);

export default s;
