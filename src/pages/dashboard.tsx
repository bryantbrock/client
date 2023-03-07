import { useMemo } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useUser } from "hooks/useUser";
import { RoleName } from "types/schema";
import NextLink from "next/link";
import { Image } from "components/Image";

type ModuleCard = {
  name: string;
  image?: string;
  description?: string;
  buttons: { path: string; label?: string; variant: string }[];
};

const testingSupplies = ({ lastOrder }: { lastOrder?: Date }): ModuleCard => ({
  name: "Testing Supplies",
  description: lastOrder
    ? `Last Order Placed: ${lastOrder.toLocaleString()} \tInventory Reorder Alert`
    : "",
  buttons: [
    { path: "/orders/history", label: "Order History", variant: "outline" },
    { path: "/orders", label: "Order History", variant: "secondary" },
  ],
});

const training: ModuleCard = {
  image: "/images/card_training.png",
  name: "Training",
  description: "Explore training resources here including videos, etc.",
  buttons: [
    { path: "/training", label: "Explore Training", variant: "secondary" },
  ],
};

const documents: ModuleCard = {
  image: "/images/card_sops.png",
  name: "Documents",
  description: "Explore the document library.",
  buttons: [
    {
      path: "/documents",
      label: "Explore Document Library",
      variant: "secondary",
    },
  ],
};

const validations: ModuleCard = {
  name: "Validation",
  description: "Upload data file (.pcrd, .eds)",
  buttons: [
    {
      path: "/validations/new",
      label: "Upload File",
      variant: "outline",
    },
    {
      path: "/validations/queue",
      label: "Validation Queue",
      variant: "secondary",
    },
  ],
};

const reports: ModuleCard = {
  image: "/images/card_reports.png",
  name: "Reports",
  description: "View Reports",
  buttons: [
    {
      path: "reports",
      label: "View Reports",
      variant: "secondary",
    },
  ],
};

const support = {
  image: "/images/card_support.png",
  name: "Support",
  description: "Contact Support",
  buttons: [
    {
      path: "/support",
      label: "Contact Support",
      variant: "secondary",
    },
  ],
};

const myLab = {
  image: "/images/card_mylab.png",
  name: "My Lab",
  description: "Update Lab Settinngs",
  buttons: [
    {
      path: "https://google.com",
      label: "View My Labs",
      variant: "secondary",
    },
  ],
};

const getReferenceLabCards = ({ lastOrder }: { lastOrder?: Date } = {}) => [
  testingSupplies({ lastOrder }),
  training,
  documents,
  validations,
  reports,
  support,
  myLab,
];

const getPOLCards = ({ lastOrder }: { lastOrder?: Date } = {}) => [
  // EMR
  // LIMS
  training,
  documents,
  // Sample Data
  validations,
  reports,
  testingSupplies({ lastOrder }),
  support,
  myLab,
];

export default withPageAuthRequired(() => {
  const { user } = useUser();

  const cards = useMemo(
    () =>
      user?.roleName === RoleName.ReferenceLab
        ? getReferenceLabCards()
        : getPOLCards(),
    [user?.roleName]
  );

  return (
    <Flex mx="auto" w="95%" maxW="1400px" direction="column">
      <Text fontSize="3xl" fontWeight="semibold" mt={10}>
        Dashboard
      </Text>
      <Flex mt={5} wrap="wrap" gap={2}>
        {cards.map(({ buttons, image, name, description }, idx) => (
          <Card w="280px" key={idx} borderWidth="1px" borderColor="gray.100">
            <CardBody>
              <Text fontSize="2xl" textAlign="center" fontWeight="semibold">
                {name}
              </Text>
              {image ? (
                <Image
                  height="85"
                  width="85"
                  alt={`${name} image`}
                  src={image}
                  mx="auto"
                />
              ) : null}
              <Text textAlign="center">{description}</Text>
            </CardBody>
            <CardFooter>
              <Flex direction="column" gap={2} w="full">
                {buttons.map(({ label, variant, path }, buttonIdx) => (
                  <NextLink href={path} passHref key={idx + buttonIdx}>
                    <Button variant={variant} as="a" w="full">
                      {label}
                    </Button>
                  </NextLink>
                ))}
              </Flex>
            </CardFooter>
          </Card>
        ))}
      </Flex>
    </Flex>
  );
});
