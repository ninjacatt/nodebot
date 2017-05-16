1. Add simple bot [Done]
2. deploy to heroku [Done]
3. Add more fun bot [Done]
4. more with mongodb [Done]
5. Define goal for chatbot 
    a. add better news filter [Done]
    b. Redminder [In Progress]
        Need to keep track of user?
    c. get menu [Done]
    d. TLDR api [Done]

Note:
1. News api account minhdev
2. LUIS Azure service account minhdev
3. git minhdevspace
4. heroku personal gmail
5. bot framework account minhdn



[Heroku contains bot codes] <--- [BOT FRAMEWORK] <- [LUIS to understand conversation]
                                        ^  ^  ^
                                        |  |__|_______________________________________
                                        |                       |                    |
                                        |                       |                    |
                                        |                       |                 [ Messenger for FB bot ]    
                                 [newsapi to get latest news]   |
                                                                |
                                                                |
                                                    [Twillio for using bot in sms]  



[DATABASE] <--> [MODELS] <--> [CONTROLERS] <--- [ROUTES] <-- REQUEST/BOT
                                    |
                                    |
                                    |
                                    V
                                RESPONSE