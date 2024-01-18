import { User } from "@prisma/client";
import { PageUnauthorizedModal } from "./page-unauthorized-modal";
import { PageLockedModal } from "./page-locked-modal";

type Props = {
	chapter: number;
	user: User | null;
};

export const PageStatusModal = ({ chapter, user }: Props) => {
	return <PageLockedModal userChapter={user.chapter} />;

	if (chapter > 1 && !user) {
		return <PageUnauthorizedModal />;
	}

	if (user) {
		if (user.chapter < chapter) {
			return <PageLockedModal userChapter={user.chapter} />;
		}
	}

	return null;
};
