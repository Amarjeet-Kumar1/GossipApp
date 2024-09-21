import AssignmentIcon from "@mui/icons-material/Assignment"

export const Doc = ({ msgParams }: any) => {
  return (
    <small>
      <div className="a-f-a">
        <AssignmentIcon />
        {msgParams.fileName}
      </div>
    </small>
  )
}
