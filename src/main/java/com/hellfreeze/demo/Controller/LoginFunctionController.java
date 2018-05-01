package com.hellfreeze.demo.Controller;

import com.hellfreeze.demo.Domain.*;
import com.hellfreeze.demo.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@Controller
public class LoginFunctionController {

    @Autowired
    GameMapRepository gameMapRepository;

    @Autowired
    GameUserRepository gameUserRepository;

    @Autowired
    HighscoreRepository highscoreRepository;

    @Autowired
    InventoryRepository inventoryRepository;

    @Autowired
    MeleeWeaponRepository meleeWeaponRepository;

    @Autowired
    OutfitRepository outfitRepository;

    @Autowired
    PlayerRepository playerRepository;

    @Autowired
    RangedWeaponRepository rangedWeaponRepository;

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

    @GetMapping("/success/{health}")
    public String successPage2(@PathVariable int health, HttpServletRequest request){
        GameUser gameUser = gameUserRepository.findByGameUserName(request.getRemoteUser());
        Player player = gameUser.getPlayer();
        player.setHealth(health);
        playerRepository.save(player);
        return "success";
    }

    @GetMapping("/getHealth")
    @ResponseBody
    public int returnHealth(HttpServletRequest request){
        GameUser gameUser = gameUserRepository.findByGameUserName(request.getRemoteUser());
        Player player = gameUser.getPlayer();
        int health = player.getHealth();
        return health;
    }

    @PostMapping("/setNewHealth")
    @ResponseBody
    public int setNewHealth(HttpServletRequest request,@RequestParam int health){
        GameUser gameUser = gameUserRepository.findByGameUserName(request.getRemoteUser());
        Player player = gameUser.getPlayer();
        player.setHealth(health);
        playerRepository.save(player);
        return health;
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

        //set default values for a player and assign it to the user
        Outfit outfit= outfitRepository.findById(8L).get();

        GameMap gameMap = gameMapRepository.findById(1L).get();

        Player player = new Player(0L,100,0,outfit.getOutfitColor(),gameMap);

        playerRepository.save(player);

        Highscore highscore = new Highscore(0L,player);

        highscoreRepository.save(highscore);

        MeleeWeapon meleeWeapon = meleeWeaponRepository.findById(1L).get();

        RangedWeapon rangedWeapon = rangedWeaponRepository.findById(1L).get();
        Inventory inventory = new Inventory(3,player,meleeWeapon,rangedWeapon);

        inventoryRepository.save(inventory);

        gameUser.addOutfit(outfit);

        gameUser.setPlayer(player);

        gameUserRepository.save(gameUser);

        String greeting = "Thank you "+gameUser.getGameUserName()+" for your registration";
        return new ModelAndView("login")
                .addObject("greeting",greeting);
    }

}
