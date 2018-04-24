package com.hellfreeze.demo.Domain;

import javax.persistence.*;

@Entity
public class Highscore {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long highscoreID;
    private Long totalScore;

    @OneToOne
    private Player player;

    public Highscore() {
    }

    public Highscore(Long totalScore, Player player) {
        this.totalScore = totalScore;
        this.player = player;
    }

    public Long getHighscoreID() {
        return highscoreID;
    }


    public Long getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Long totalScore) {
        this.totalScore = totalScore;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }
}
