package com.hellfreeze.demo.Controller;

import com.hellfreeze.demo.Domain.GameUser;
import com.hellfreeze.demo.Repository.GameUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.validation.Valid;

@Controller
public class LoginFunctionController {

    @Autowired
    GameUserRepository gameUserRepository;

    @GetMapping("/")
    public String indexPage(){
        return "redirect:login";
    }

    @GetMapping("/login")
    public String loginPage(){
        return "login";
    }

    @GetMapping("/hemsida")
    public String gameHub(){
        return "hemsida";
    }

    @GetMapping("/success")
    public String successPage(){
        return "success";
    }

    @GetMapping("/registration")
    public ModelAndView registrationPage(){
        return new ModelAndView("registration").addObject("gameUser",new GameUser());
    }

    @PostMapping("/registration")
    public ModelAndView submitForm(@Valid GameUser gameUser, BindingResult bindingResult){
        if (bindingResult.hasErrors()) {
            return new ModelAndView("registration").addObject("gameUser",new GameUser());
        }
        //add validation for username and email to be unique.
        GameUser gameUser1 = gameUserRepository.findByGameUserName(gameUser.getGameUserName());
        GameUser gameUser2 = gameUserRepository.findByEmail(gameUser.getEmail());
        if(gameUser1 != null || gameUser2 != null){
            return new ModelAndView("registration").addObject("gameUser",new GameUser());
        }
        
        //send in password and encode it
        PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
        gameUser.setPassword(passwordEncoder.encode(gameUser.getPassword()));

        gameUserRepository.save(gameUser);
        return new ModelAndView("redirect:success");
    }

}
