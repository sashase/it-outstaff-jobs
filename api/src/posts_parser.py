import configparser
from datetime import date, timedelta
from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError
from telethon.tl.functions.messages import (GetHistoryRequest)
from fastapi import HTTPException


config = configparser.ConfigParser()
config.read("config.ini")

api_id = config['Telegram']['api_id']
api_hash = config['Telegram']['api_hash']

api_hash = str(api_hash)

phone = config['Telegram']['phone']
username = config['Telegram']['username']


async def connect_telegram_client():
    client = TelegramClient(username, api_id, api_hash)
    await client.connect()

    if not await client.is_user_authorized():
        await client.send_code_request(phone)
        try:
            await client.sign_in(phone, input('Enter the code: '))
        except SessionPasswordNeededError:
            await client.sign_in(password=input('Password: '))
    return client

two_months_ago = date.today() - timedelta(days=30)


async def update_messages(source, date):
    try:
        client = await connect_telegram_client()

        my_channel = await client.get_entity(source)

        offset_id = 0
        limit = 1
        all_messages = []
        total_messages = 0
        total_count_limit = 3
        end_reached = False

        while True:
            if end_reached == True:
                break
            history = await client(GetHistoryRequest(
                peer=my_channel,
                offset_id=offset_id,
                offset_date=date,
                add_offset=0,
                limit=limit,
                max_id=0,
                min_id=0,
                hash=0
            ))
            if not history.messages:
                break
            messages = history.messages
            for message in messages:
                author = None
                if message.from_id:
                    author = message.from_id.user_id
                if message.message != None:
                    all_messages.append(
                        {"id": message.id, "text": message.message, "date": message.date, "author": author})
            offset_id = messages[len(messages) - 1].id
            total_messages = len(all_messages)
            if total_count_limit != 0 and total_messages >= total_count_limit:
                break
        return all_messages
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
