import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useChallengeReceived } from '../../../classes/TownController';
import useTownController from '../../../hooks/useTownController';

export default function AcceptChallengeRPS(): JSX.Element {
  const coveyTownController = useTownController();
  const newPotentialChallenger = useChallengeReceived();
  const player = coveyTownController.ourPlayer;

  const closeModal = useCallback(() => {
    coveyTownController.unPause();
    close();
  }, [coveyTownController]);

  const toast = useToast();

  let isOpen = newPotentialChallenger !== undefined;

  const challengerUsername = coveyTownController.players.find(
    p => p.id === newPotentialChallenger,
  )?.userName;

  const acceptRPSChallenge = useCallback(async () => {
    try {
      if (newPotentialChallenger) {
        await coveyTownController.startRPS({
          challengee: player,
          challenger: newPotentialChallenger,
          response: true,
        });
      }

      // add startRPS game in TownController, it takes in a response, emits the new game...

      toast({
        title: 'Challenge Accepted!',
        status: 'success',
      });
      coveyTownController.unPause();
      closeModal();
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: 'Unable to accept challenge',
          description: err.toString(),
          status: 'error',
        });
      } else {
        console.trace(err);
        toast({
          title: 'Unexpected Error',
          status: 'error',
        });
      }
    }
  }, [closeModal, player, coveyTownController, toast, newPotentialChallenger]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        isOpen = false;
        closeModal();
        coveyTownController.unPause();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {challengerUsername} challenges you to a game of Rock Paper Scissors. Do you accept?
        </ModalHeader>
        <ModalCloseButton />
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={acceptRPSChallenge}>
            Accept Challenge
          </Button>
          <Button onClick={closeModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
