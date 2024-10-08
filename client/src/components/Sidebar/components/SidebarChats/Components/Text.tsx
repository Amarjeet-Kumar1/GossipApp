export const Text = ({ otherUser, msgParams, type }: any) => {
  return type === "group" ? (
    <small>
      <strong>{otherUser?.split(" ").slice(0, 2).join(" ") ?? "You"}</strong>
      :&nbsp;{msgParams.text?.replaceAll("<br/>")}
    </small>
  ) : (
    <small>{msgParams.text?.replaceAll("<br/>")}</small>
  )
}
