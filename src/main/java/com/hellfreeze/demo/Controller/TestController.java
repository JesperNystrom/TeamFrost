package com.hellfreeze.demo.Controller;

import com.hellfreeze.demo.Domain.Inventory;
import com.hellfreeze.demo.Domain.MeleeWeapon;
import com.hellfreeze.demo.Domain.Player;
import com.hellfreeze.demo.Domain.RangedWeapon;
import com.hellfreeze.demo.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

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
    public String test(){
////        GameUser user1 = new GameUser();
////
////        gameUserRepository.save(user1);
//
////        GameUser user2 = new GameUser("Kalle","123","kalle@anka.com");
////        gameUserRepository.save(user2);
//
//        GameUser user3 = new GameUser("Musse", "abc", "musse@pigg.com");
//
//        Outfit outfit3 = new Outfit();
////
////        gameUserRepository.save(user1);
//        outfitRepository.save(outfit3);
////
//        user3.addOutfit(outfit3);
//        gameUserRepository.save(user3);
//
//        String txt = user3.getOutfits().toString();
////
//        // GameUser user2 = gameUserRepository.findById(user1.getUserID()).get();
////
////        return user2;
//        return user3.getOutfits();

        //get inventory by a player object
//        MeleeWeapon meleeWeapon1 = new MeleeWeapon("Slayer", 300,"Basic",25);
//        RangedWeapon rangedWeapon1 = new RangedWeapon("Hawkeye",280,"Basic",35);
//        Player player1 = new Player();
//
//        Inventory inventory1 = new Inventory(3,player1,meleeWeapon1,rangedWeapon1);
//
//        meleeWeaponRepository.save(meleeWeapon1);
//        rangedWeaponRepository.save(rangedWeapon1);
//        playerRepository.save(player1);
//        inventoryRepository.save(inventory1);
//
//        Inventory inventory2 = inventoryRepository.getInventoryByPlayer(player1);
//
//
//        return inventory2;
        return  "ok";
    }
}
