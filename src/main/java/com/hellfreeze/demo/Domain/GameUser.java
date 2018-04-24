package com.hellfreeze.demo.Domain;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class GameUser {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long gameUserID;
    private String gameUserName;
    private String password;
    private String email;

    @OneToOne
    private Player player;

    @ManyToMany (cascade = CascadeType.ALL)
    @JoinTable(name = "gameuser_outfit", joinColumns =
    @JoinColumn(name = "gameuser_id", referencedColumnName = "gameUserID"),
            inverseJoinColumns = @JoinColumn(name = "outfit_id", referencedColumnName = "outfitID"))
    private Set<Outfit> outfits = new HashSet<>();

    public GameUser() {
    }

    public GameUser(String gameUserName, String password, String email) {
        this.gameUserName = gameUserName;
        this.password = password;
        this.email = email;
    }

    public GameUser(String gameUserName, String password, String email, Player player, Set<Outfit> outfits) {
        this.gameUserName = gameUserName;
        this.password = password;
        this.email = email;
        this.player = player;
        this.outfits = outfits;
    }

    public Long getUserID() {
        return gameUserID;
    }

    public String getUserName() {
        return gameUserName;
    }

    public void setUserName(String userName) {
        this.gameUserName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Set<Outfit> getOutfits() {
        return outfits;
    }

    public void setOutfits(Set<Outfit> outfits) {
        this.outfits = outfits;
    }

    public void addOutfit(Outfit outfit){
        this.outfits.add(outfit);
    }

    @Override
    public String toString() {
        return "GameUser{" +
                "outfits=" + outfits +
                '}';
    }
}
