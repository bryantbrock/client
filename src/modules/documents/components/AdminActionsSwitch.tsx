import { Flex, Switch, Text } from "@chakra-ui/react";

type Props = { onChange: () => void };

export const AdminActionsSwitch = ({ onChange }: Props) => (
  <Flex gap={4} align="center">
    <Flex justify="space-between" align="center">
      <Text fontWeight="bold" minW="100px">
        Enable admin actions
      </Text>
    </Flex>

    <Switch id="email-alerts" onChange={() => onChange()} />
  </Flex>
);
