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





# 多头自注意力机制   
🧠 一句话概括每个 token 都和其他所有 token 计算“我该关注谁”，并从多个不同角度（多个头）同时去理解整句话。

Self-Attention：每个词抬头看全句。

Multi-Head：每个词有好几个“视角”同时在看。

输出结果：每个词都变成“结合全局上下文的语义向量”。





计算过程简化版

每个 token 的 embedding 会被映射成三个向量：

Q（Query）：我要关注谁
K（Key）：我是谁
V（Value）：我的语义内容

然后对所有 token 做矩阵乘法：
Attention(Q, K, V) = softmax(QKᵀ / √dₖ) V


这一步就是在算“相关性分数”：
Q × Kᵀ：代表当前词对其他所有词的注意力强度；
softmax：把这些分数归一化成权重；
乘上 V：再根据这些权重聚合各个词的语义。
于是，每个 token 的新向量就是：
“我自己的意思 + 我认为重要的其它词的信息”。


| 项目                  | 谁决定的                     | 是否自动学习  | 是否有上限       |
| ------------------- | ------------------------ | ------- | ----------- |
| **头的数量（num_heads）** | 人类（模型架构参数）               | ❌ 否     | ✅ 有上限（计算约束） |
| **每个头的关注角度**        | 模型自己训练学到                 | ✅ 是     | ❌ 无固定限制     |
| **头的作用是否固定**        | 否，自动分工                   | ✅ 是     | ❌ 无需指定      |
| **头能否被控制/剪枝**       | 可以通过 fine-tune 或 pruning | ✅ 可人为干预 | ✅ 工程上控制     |
