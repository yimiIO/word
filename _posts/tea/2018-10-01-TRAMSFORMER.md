---
layout: article
title: "LLMS-TRANSFORMER模型"
description: "EverMemo"
category: tea
comments: true
tags: []
image:
  feature:
  teaser: daocheng.jpg
  thumb:
---


🧠 为什么它厉害？

传统 RNN / LSTM 要“从前到后”读句子，像人读长句要记笔记，越往后越忘。
Transformer 不需要顺序，它一次把整句话放进脑子里，然后自己算出每个词与其他词的关系。

比如这句：

“猫追狗，因为它害怕。”

模型要理解“它”指谁？
Transformer 会计算每个词对其他词的相关程度（注意力），发现“它”和“狗”关系最强，所以知道“它”=狗。

>  Self-Attention(自注意力) Muti-Head Attention(多头注意力) Feed-Forward+残差结构（ResNet）

⚙️ 核心结构（只需记这3个）
	1.	Self-Attention（自注意力）：
每个词看整句话，算出“我该注意谁”，得到一个权重分布。
	2.	Multi-Head Attention（多头注意力）：
让模型用多个角度（语义、语法、情感等）同时理解一句话。
	3.	Feed-Forward + 残差结构（ResNet）：
每层都会再加工一次信息，并把原信息保留一点，防止“忘记”。


