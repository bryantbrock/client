import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  children: ({ onOpen }: { onOpen: () => void }) => ReactNode;
  onDelete: () => void;
};

export const ConfirmDeleteModal = ({ children, onDelete }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children({ onOpen })}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton onClick={onDelete} />
          <ModalBody
            pb={6}
            display="grid"
            gap={5}
            maxH="1200px"
            overflowY="scroll"
          >
            <Text>Are you sure?</Text>
          </ModalBody>

          <ModalFooter display="flex" gap={2}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="danger" mr={3}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
