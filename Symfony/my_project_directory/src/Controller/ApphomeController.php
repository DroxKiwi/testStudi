<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ApphomeController extends AbstractController
{

    #[Route('/apphome', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('apphome/index.html.twig', [
            'controller_name' => 'DefaultController'
        ]);
    }
}
