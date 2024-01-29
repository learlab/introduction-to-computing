"use client";

import { useEffect, useState } from "react";
import { QuestionBox } from "./question-box";
import { useQA } from "../context/qa-context";
import { createPortal } from "react-dom";
import { NextChunkButton } from "./next-chunk-button";
import { ScrollBackButton } from "./scroll-back-button";
import { SelectedQuestions } from "@/lib/question";
import { getChunkElement } from "@/lib/utils";

type Props = {
	selectedQuestions: SelectedQuestions;
	pageSlug: string;
	isFeedbackEnabled: boolean;
};

export const QuestionControl = ({
	selectedQuestions,
	pageSlug,
	isFeedbackEnabled,
}: Props) => {
	// Ref for current chunk
	const [nodes, setNodes] = useState<JSX.Element[]>([]);
	const {
		currentChunk,
		chunks,
		isPageFinished,
		setIsPageFinished,
		isLastChunkWithQuestion,
	} = useQA();

	const addNode = (node: JSX.Element) => {
		setNodes((nodes) => [...nodes, node]);
	};

	const hideNextChunkButton = (chunkId: string) => {
		const el = getChunkElement(chunkId);
		const button = el.querySelector(
			":scope .next-chunk-button-container",
		) as HTMLDivElement;

		if (button) {
			button.remove();
		}
	};

	const insertScrollBackButton = (el: HTMLDivElement) => {
		if (el.parentElement) {
			const buttonContainer = document.createElement("div");
			buttonContainer.className =
				"scroll-back-button-container flex justify-center items-center p-4 gap-2";
			buttonContainer.style.filter = "none";

			// note this the scroll back button is inserted as a sibling to the content chunk
			// so it won't be blurred as a children
			el.parentElement.insertBefore(buttonContainer, el.nextSibling);

			addNode(createPortal(<ScrollBackButton />, buttonContainer));
		}
	};

	const hideScrollBackButton = () => {
		const button = document.querySelector(
			".scroll-back-button-container",
		) as HTMLDivElement;

		if (button) {
			button.remove();
		}
	};

	const insertNextChunkButton = (el: HTMLDivElement, chunkSlug: string) => {
		// insert button container
		const buttonContainer = document.createElement("div");
		buttonContainer.className =
			"next-chunk-button-container flex justify-center items-center p-4 gap-2";
		el.style.filter = "none";
		el.appendChild(buttonContainer);

		addNode(
			createPortal(
				<NextChunkButton
					clickEventType="chunk reveal"
					chunkSlug={chunkSlug}
					pageSlug={pageSlug}
					standalone
					className="bg-red-400  hover:bg-red-200 text-white m-2 p-2"
				>
					Click here to continue reading
				</NextChunkButton>,
				buttonContainer,
			),
		);
	};

	const insertQuestion = (el: HTMLDivElement, chunkId: string) => {
		const questionContainer = document.createElement("div");
		questionContainer.className = "question-container";
		el.appendChild(questionContainer);

		const q = selectedQuestions.get(chunkId);

		if (q) {
			addNode(
				createPortal(
					<QuestionBox
						question={q.question}
						answer={q.answer}
						chunkSlug={chunkId}
						pageSlug={pageSlug}
						isFeedbackEnabled={isFeedbackEnabled}
					/>,
					questionContainer,
				),
			);
		}
	};

	const maskChunk = (chunkId: string, chunkIndex: number) => {
		const el = getChunkElement(chunkId);
		const currentIndex = chunks.indexOf(currentChunk);
		const isChunkUnvisited = currentIndex === -1 || chunkIndex > currentIndex;
		if (selectedQuestions.has(chunkId)) {
			insertQuestion(el, chunkId);
		}

		if (chunkIndex !== 0 && isChunkUnvisited) {
			el.style.filter = "blur(4px)";
		}

		if (chunkIndex === chunks.length - 1) {
			insertScrollBackButton(el);
		}
	};

	const revealChunk = (currentChunk: string) => {
		const idx = chunks.indexOf(currentChunk);
		if (idx === -1) {
			return;
		}

		const currentChunkId = chunks.at(idx);
		const prevChunkId = idx > 0 ? chunks.at(idx - 1) : undefined;

		if (currentChunkId) {
			const currentChunkElement = getChunkElement(currentChunkId);
			currentChunkElement.style.filter = "none";
			if (!selectedQuestions.has(currentChunkId) && idx !== chunks.length - 1) {
				insertNextChunkButton(currentChunkElement, currentChunk);
			}
		}

		// when a fresh page is loaded,. set up ref data and prepare chunk styles
		if (prevChunkId) {
			hideNextChunkButton(prevChunkId);
		}

		if (idx === chunks.length - 1) {
			hideScrollBackButton();
		}
	};

	useEffect(() => {
		if (!isPageFinished) {
			chunks.forEach(maskChunk);
		}
	}, []);

	useEffect(() => {
		if (!isPageFinished) {
			revealChunk(currentChunk);
			// in the special case of the last chunk with a question
			// the page is not considered finished when currentChunk === lastChunk
			// when the last chunk contains the question
			// page finished is controlled via the corresponding question-box -> next-chunk-button
			if (!isLastChunkWithQuestion) {
				if (currentChunk === chunks[chunks.length - 1]) {
					setIsPageFinished(true);
				}
			}
		}
	}, [currentChunk]);

	return nodes;
};
