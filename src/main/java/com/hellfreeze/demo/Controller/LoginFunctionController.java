package com.hellfreeze.demo.Controller;

import com.hellfreeze.demo.Domain.GameUser;
import com.hellfreeze.demo.Repository.GameUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class LoginFunctionController {

    @Autowired
    GameUserRepository gameUserRepository;

    @GetMapping("/success")
    public String successPage(){
        return "success";
    }

    @GetMapping("/registration")
    public ModelAndView registrationPage(){
        return new ModelAndView("registration").addObject("gameUser",new GameUser());
    }

    @PostMapping("/registration")
    public String submitForm(@ModelAttribute GameUser gameUser){
        gameUserRepository.save(gameUser);
        return "redirect:success";
    }

}
