export default function Job(props: any) {
  return (
    <div className="rounded-md shadow-lg p-3 border-gray-100 border">
      <h3 className="text-center font-medium text-lg">
        Job #{props.number + 1}
      </h3>
      <ul>
        <li>
          <span className="font-medium">Type: </span>
          {props.type != "0" ? props.type : "N/A"}
        </li>
        <li>
          <span className="font-medium">Seniority: </span>
          {props.seniority != "0" ? props.seniority : "N/A"}
        </li>
        <li>
          <span className="font-medium">Stack: </span>
          {props.stack != "0" ? props.stack : "N/A"}
        </li>
        <li>
          <span className="font-medium">Location: </span>
          {props.location != "0" ? props.location : "N/A"}
        </li>
        <li>
          <span className="font-medium">Rate: </span>
          {props.rate ? props.rate : "N/A"}
        </li>
        <li>
          <span className="font-medium">English level: </span>
          {props.english_level != "0" ? props.english_level : "N/A"}
        </li>
      </ul>
    </div>
  )
}
