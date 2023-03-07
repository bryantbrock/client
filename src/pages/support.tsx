import { Text, Box } from "@chakra-ui/react";

export default function Support() {
  return (
    <Box sx={{ textAlign: "center", overflow: "visible", minHeight: "100%" }}>
      <Text textAlign="center" fontSize="3xl" mb={10}>
        Support
      </Text>
      <iframe
        src="https://forms.monday.com/forms/embed/5fcf6050bc23bd97b3569cee9d946b77?r=use1"
        style={{
          minHeight: "1600px",
          width: "100%",
        }}
      ></iframe>
    </Box>
  );
}
