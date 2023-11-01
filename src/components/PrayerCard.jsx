import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
export default function PrayerCard(props) {
  return (
    <Card sx={{ width: 170 }}>
      <CardMedia
        sx={{ height: 130 }}
        image={props.image}
        title="green iguana"
      />
      <CardContent style={{ padding: "0 15px" }}>
        <Typography gutterBottom variant="h2" component="div">
          {props.title}
        </Typography>
        <Typography variant="h4" color="text.secondary">
          {props.time}
        </Typography>
      </CardContent>
    </Card>
  );
}
