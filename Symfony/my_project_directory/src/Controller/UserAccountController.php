<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Form\ColorType;
use App\Entity\Color;

class UserAccountController extends AbstractController
{
    #[Route('/useraccount', name: 'app_user_account')]
    public function index(Request $request): Response
    {
        $color = new Color();
        $form = $this->createForm(ColorType::class, $color);
        dump($form);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $uuid = $color->getHashtag();
        }
        return $this->render('useraccount/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}