"use client";

import { setLessonCompleted } from "@/components/academy/progress-client";
import { YouTubeFacade } from "@/components/shared/YouTubeFacade";

/** The lesson's video behind the click to load facade. Playing it to the end marks the lesson complete. */
export function LessonVideo({ course, lesson, videoId, title }: { course: string; lesson: string; videoId: string; title: string }) {
  return (
    <YouTubeFacade
      source={{ kind: "video", id: videoId }}
      title={title}
      poster="large"
      onEnded={() => setLessonCompleted(course, lesson, true)}
    />
  );
}
