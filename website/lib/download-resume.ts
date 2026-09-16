export const RESUME_FILENAME = "Musharraf_Aziz_CV.pdf";
export const RESUME_PUBLIC_PATH = "/Musharraf_Aziz_CV.pdf";

export function downloadResume() {
  const a = document.createElement("a");
  a.href = RESUME_PUBLIC_PATH;
  a.download = RESUME_FILENAME;
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
