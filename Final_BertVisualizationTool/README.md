# BertVisualizationTool
## 110學年度NTNU_CSIE專題研究
主題:自然語言模型(BERT)視覺化<br>
指導教授：王科植 KCWang 教授<br>
時間：2021/07 ~ 2022/06<br>

透過將BERT中各屬性資料視覺化，希望能幫助資料科學家更好的理解、修改BERT的框架，加速其他fine-tune模型的訓練<br>

補更：由於結果不彰，經諮詢 NLP 工程師與語言學專家，他們表示語言本身就不太適合使用此種形式來表示：<br>
    1. 語言本身並不連續：每個詞語每個詞之間都是獨立的(更不用說每個字)，因此使用能表示連續資料型態的「向量」劃分文本本身就不會準確<br>
        (因此這個實驗看似是失敗的但結果是成功的？因為結果的雜亂無章正好證明了語言的這種特性)<br>
    2. 剛出生的新生兒學會說話並不是純粹靠模仿大人：<br>
        人類本身腦中就有對於語言基本的解讀架構，而不像 ML 完全只分析"整句的意思"，而是會套用語言學中的句型結構和聲調等多重判斷<br>
        因此想讓 ML 純粹靠訓練去理解整段文本的意思會效果不彰<br>
        Ex. 小孩子有時候會講一些奇怪的用語，例如"蜂蜜蟲"=蜜蜂，"生蛋獸"=雞 等，我們雖然沒有聽過這些詞，但是卻能依據整段鋸子的巨型去判斷他的詞性，再透過文意理解去判斷此詞的真實含意<br>
    未來我會修讀語言學相關課程，嘗試從語言本身的結構，透過語言學的概念去做理解<br>

================以下為專案基本資訊================<br>

目前進度：<br>
1.可以繪製[CLS]token中每一 dimension 的值，觀察整體走向來判別此句文本是正向情緒或是負面情感<br>
    
2.可以比對在不同model下，每一層對於同一文本之attention處理是否相似<br>
    方法：計算兩個model中不同層layer，對於attention權重之歐式距離，假設距離越短者代表兩者所做的處理越相關<br>
    詳細內容請洽： /D3/ModelComparison.ipynb<br>
3.同一組資料在 BERT 內部不同層中的近似分布<br>
    使用 umap 將每組文本在 BERT 中之向量值二維化(此種方法能保留極高的資料特性而不會失真)，以方便觀測<br>
    umap 官方網站：https://umap-learn.readthedocs.io/en/latest/basic_usage.html<br>
    詳細內容請洽： /D3/ModelComparison.ipynb<br>
    
未來期望：<br>
1.分析768個dimension(bert-base-uncased)中，哪幾層對於"情緒"可能比較相關，當然不排除對於其他屬性做研究<br>
2.提供不同算法計算不同層layer的歐式距離，讓使用者能自行選擇<br>
3.提供其他不同屬性的資料，例如hidden layer中每一層內[CLS]token之變化，並試圖繪製出趨勢<br>
及其他未列出但對於分析BERT有用之資料比對<br>
<br>

檔案說明：<br>
positive/negative.csv:句型幾乎相同但語意顛倒的文本範例，Ex.postive.csv中第一句與negative.csv中第一句即為顛倒的句型<br>
pos_neg.ipynb:比較postive與negative，將其[CLS]token之向量值繪製成線狀圖，以方便觀察走向<br>
attention1.ipynb:練習使用之程式<br>
ModelComaprison.ipynb:比較base與large兩個不同模型對於同一文本之各層attention值之關聯性，使用歐式距離計算<br>
/image：存放以上所有程式輸出的圖片檔<br>
/D3: 存放所有期末專案的檔案，使用 jupyter notebook 做 BERT 的資料處理，並搭配 D3.js 視覺化結果<br>
    與 BERT 相關的內容均在 ModelComparison.ipynb<br>
    

目前檔案較為雜碎，因為是分不同任務執行，還在練習階段中<br>
之後會整合成一個可以執行的工具<br>
