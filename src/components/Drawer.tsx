import { ReactNode, useMemo, useRef } from "react";
import {
  Button,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
  Drawer as ChakraDrawer,
} from "@chakra-ui/react";

type RenderForm = { form: ReactNode; id: string; header?: string };

type Props = {
  children: ({ onOpen }: { onOpen: () => void }) => void;
  renderForm?: (onClose: () => void) => RenderForm | undefined;
};

export const Drawer = ({ renderForm, children }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    id: formId,
    form,
    header,
  } = useMemo(
    () => renderForm?.(onClose) ?? ({} as RenderForm),
    [onClose, renderForm]
  );

  return (
    <>
      {children({ onOpen })}
      <ChakraDrawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="md"
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{header}</DrawerHeader>

          <DrawerBody>{form}</DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" form={formId} type="submit">
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </ChakraDrawer>
    </>
  );
};
