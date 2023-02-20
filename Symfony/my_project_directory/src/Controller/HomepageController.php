<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use Doctrine\Persistence\ManagerRegistry;

use App\Entity\User;
use App\Repository\UserRepository;


class HomepageController extends AbstractController
{
    #[Route('/homepage', name: 'app_homepage')]
    public function index(ManagerRegistry $doctrine): Response
    {
        $entityManager = $doctrine->getManager();
        //$users = $entityManager->getRepository(User::class)->findAll();
        $users = $entityManager->getRepository(User::class)->findBy([],['uuid' => 'desc']);
        $currentUser = $this->getUser();
        return $this->render('homepage/index.html.twig', [
            'users' => $users,
            'currentuser' => $currentUser
        ]);
    }
}
