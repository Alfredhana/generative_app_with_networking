import React, { useEffect, useRef } from 'react';

export const Animation1 = (p5) => {
  
  let font;
  let joinedText;
  const excludedWords = ['the', 'is', 'of', 'a', 'they', 'that', 'an', 'to', 'in', 'his', 'are', 'may', 'and', 'by', 's', 'it', 'sol', 'its', "than", "cannot", "but", "who", "goes", "rather", "others", "for", "as", "too", "there"];
  const DRAW_BALLS = true;
  const LERP_AMOUNT = 0.0000001;
  let balls = []; 

  p5.preload = () => {
    font = p5.loadFont('FreeSans.otf');
    joinedText = p5.loadStrings('https://openprocessing-usercontent.s3.amazonaws.com/files/user5362/visual1053499/h907d14b78c742717022d1f171303fbf3/SolLeWitt_sentences.txt');
  };

  p5.setup = () => {
    p5.createCanvas(window.innerWidth * 0.8, window.innerHeight * 0.8);
    p5.strokeWeight(2);
    p5.textFont(font);
    p5.textSize(48);

    joinedText = joinedText.join(' ');
    const words = joinedText.match(/\w+/g);
    const words_ = words.filter(word => !excludedWords.includes(word.toLowerCase()));
    const words_no_duplicates = removeDuplicates(words_);

    words_no_duplicates.forEach(item => {
      const v = p5.createVector(p5.random(p5.width - 100), p5.random(100, p5.height - 100));
      if (p5.random() < 0.1) {
        balls.push({
          pos: v,
          vel: p5.createVector(2 * Math.cos(p5.random(p5.TAU)), 2 * Math.sin(p5.random(p5.TAU))),
          bounds: font.textBounds(item, v.x, v.y, 48),
          txt: item
        });
      }
    });
  };

  p5.draw = () => {
    p5.background(0);
    for (let ball of balls) {
      ball.pos.add(ball.vel);
      ball.bounds = font.textBounds(ball.txt, ball.pos.x, ball.pos.y, 48);

      if (ball.bounds.x < 0 || ball.bounds.x + ball.bounds.w > p5.width) {
        ball.vel.x = -ball.vel.x;
      }
      if (ball.bounds.y < 0 || ball.bounds.y + ball.bounds.h > p5.height) {
        ball.vel.y = -ball.vel.y;
      }

      if (DRAW_BALLS) {
        p5.fill(255);
        p5.noStroke();
        p5.text(ball.txt, ball.pos.x, ball.pos.y);
      }

      for (let ball2 of balls) {
        if (ball2 === ball) continue;

        if (
          balls.indexOf(ball) > balls.indexOf(ball2) &&
          ((ball2.pos.x - ball.pos.x) ** 2 + (ball2.pos.y - ball.pos.y) ** 2) < 20000
        ) {
          p5.noFill();
          p5.stroke(240, 150, 20);
          p5.rect(ball.bounds.x, ball.bounds.y, ball.bounds.w, ball.bounds.h);
          p5.rect(ball2.bounds.x, ball2.bounds.y, ball2.bounds.w, ball2.bounds.h);
          p5.line(ball.pos.x, ball.pos.y, ball2.pos.x, ball2.pos.y);
          p5.fill(240, 150, 20);
          p5.text(ball.txt, ball.pos.x, ball.pos.y);
          p5.text(ball2.txt, ball2.pos.x, ball2.pos.y);
        }
        const velocityDiff = p5.createVector(ball2.pos.x - ball.pos.x, ball2.pos.y - ball.pos.y);
        ball.vel.lerp(velocityDiff, LERP_AMOUNT);
      }
    }
  };

  function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }
};