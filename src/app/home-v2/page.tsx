import { redirect } from "next/navigation";

// The White Relief home page now lives at "/"; keep old preview links working.
export default function HomeV2() {
  redirect("/");
}
