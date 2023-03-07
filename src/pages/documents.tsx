import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Grid,
  useBoolean,
} from "@chakra-ui/react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { SearchIcon } from "@chakra-ui/icons";
import { useDebounce } from "usehooks-ts";
import { OperatingAsSelect } from "modules/documents/components/ClientSelect";
import { useUser } from "hooks/useUser";
import { RoleName } from "types/schema";
import { AdminActionsSwitch } from "modules/documents/components/AdminActionsSwitch";
import { DocumentsTable } from "modules/documents/components/DocumentsTable";
import { DocumentsFiltersAccordion } from "modules/documents/components/DocumentsFiltersAccordion";

export default withPageAuthRequired(() => {
  const { user } = useUser();
  const [adminActionsEnabled, { toggle: toggleEnableAdminActions }] =
    useBoolean();

  const [selectedTagNames, setSelectedTagNames] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const isAdmin = useMemo(
    () => user?.roleName === RoleName.Admin,
    [user?.roleName]
  );

  const onToggleTagName = useCallback((name: string) => {
    setSelectedTagNames((names) =>
      names.includes(name)
        ? names.filter((n) => n !== name)
        : names.concat(name)
    );
  }, []);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  return (
    <Flex gap={4} mx="auto" w="95%" maxW="1400px" direction="column" mb={4}>
      <Flex direction="column" mt={8}>
        <Text fontSize="3xl" fontWeight="semibold">
          Documents
        </Text>
        <Flex justify="space-between" w="full" align="flex-end" gap={4}>
          <InputGroup maxW="320px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              onChange={(e) => setSearchTerm(e.target.value)}
              size="md"
              placeholder="Search"
              borderColor="gray.400"
              ref={searchRef}
            />
          </InputGroup>

          <Grid gap={2}>
            <OperatingAsSelect
              distributorId={
                user?.roleName === RoleName.Distributor ? user.id : undefined
              }
            />
            {isAdmin ? (
              <AdminActionsSwitch onChange={() => toggleEnableAdminActions()} />
            ) : null}
          </Grid>
        </Flex>
      </Flex>

      <DocumentsFiltersAccordion
        canModify={isAdmin && adminActionsEnabled}
        onChange={setSelectedTagNames}
        selected={selectedTagNames}
      />

      <DocumentsTable
        canModify={isAdmin && adminActionsEnabled}
        searchTerm={debouncedSearchTerm}
        selectedTagNames={selectedTagNames}
        onToggleTagName={onToggleTagName}
      />
    </Flex>
  );
});
