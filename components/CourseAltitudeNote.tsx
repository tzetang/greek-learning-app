import Link from "next/link";

interface Props {
  form?: string;
  topic?: string;
}

export default function CourseAltitudeNote({ form, topic }: Props) {
  const tutorQuery = form
    ? `?q=${encodeURIComponent(`Explain ${form} — is this beyond what we've covered?`)}`
    : "";

  return (
    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <p className="font-medium">Beyond course level</p>
      <p className="mt-0.5 text-amber-700">
        {topic
          ? `${topic} goes beyond what this course covers in depth.`
          : "This form or concept goes beyond what this course covers."}
        {" "}The morpheme breakdown is shown for reference, but full analysis requires
        more advanced study.
      </p>
      <Link
        href={`/tutor${tutorQuery}`}
        className="mt-2 inline-block font-medium text-blue-600 hover:underline"
      >
        Ask the Tutor →
      </Link>
    </div>
  );
}
