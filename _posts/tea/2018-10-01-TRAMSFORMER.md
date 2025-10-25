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


>  第一步：Tokenization (文本变成Token) 


## Token词表

| 模型                     | 使用的分词算法                             | 核心原理                                | 词表规模    | 特点与优缺点                                        |
| ---------------------- | ----------------------------------- | ----------------------------------- | ------- | --------------------------------------------- |
| **GPT-3（2020）**        | **Byte Pair Encoding（BPE）**         | 统计文本中最常见的字节对，不断合并形成更大的单元            | 50,257  | 英文优化，对中文支持较差，一个汉字常被拆成 3~4 个 token             |
| **GPT-4（2023）**        | **tiktoken（BPE 改进版）**               | 延续 BPE，但优化了 UTF-8 兼容性与跨语言支持，增加上下文长度 | 100,256 | 多语言支持更好，减少了中文、emoji 等特殊字符的切分损耗                |
| **Llama 3（2024）**      | **SentencePiece（Unigram + BPE 混合）** | 通过统计概率选择最佳子词集合，可兼容多语言与Unicode       | 128,000 | 对中文、韩文、日文支持更自然，能识别常见词块，如“海南”“人工智能”整体成一个 token |
| **Claude / Gemini 系列** | **SentencePiece 或 WordPiece 派生算法**  | 类似于 BERT 的分词逻辑，以子词（subword）为单位      | ~100K   | 稳定、多语言泛化好，但不如 Llama3 在长上下文下压缩率高               |



2020年的 GPT-3，Token词表：50257 个 Token

2023年的 GPT-4，Token词表：100256 个 Token

2024年的 Llama 3，Token词表：128000 个 Token


如果输入内容是：海南麒麟瓜

逐字信息：
海，unicode: 28023，utf8: b'\xe6\xb5\xb7'
南，unicode: 21335，utf8: b'\xe5\x8d\x97'
麒，unicode: 40594，utf8: b'\xe9\xba\x92'
麟，unicode: 40607，utf8: b'\xe9\xba\x9f'
瓜，unicode: 29916，utf8: b'\xe7\x93\x9c'

通过 tiktoken 处理之后得到的 Token 序列是：
（共 11 个 Token）

b'\xe6\xb5\xb7'
b'\xe5\x8d\x97'
b'\xe9'
b'\xba'
b'\x92'
b'\xe9'
b'\xba'
b'\x9f'
b'\xe7'
b'\x93'
b'\x9c'

从中文语义角度，它可以被分词成：

「海南」「麒麟瓜」「很好吃」
也可以被切成：

「海」「南」「麒」「麟」「瓜」「很」「好」「吃」

但是——模型的 tokenizer（分词器） 只会选 一种固定方式。

⚙️ 因为每个模型在训练时，就已经固定了一套「词表」(vocabulary) 和 切词算法。
