import { IonButton, IonCard, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Storage } from '@capacitor/storage';
import './Tab1.css';
import { useEffect, useState } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
}

const addBooks = async (books:Book[]) => {
  const res = await Storage.get({ key: 'books' }) as {value: string};
  try {
    const prevBooks = ((JSON.parse(res.value) || []) as Book[]);
    await Storage.set({
      key: 'books',
      value: JSON.stringify([...prevBooks, ...books]),
    });
  } catch (error) {
    console.error(error);
  }
}

const getBooks = async ():Promise<Book[]> => {
  const ret = await Storage.get({ key: 'books' }) as {value: string};
  try {
    return (JSON.parse(ret.value) || []) as Book[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const removeBook = async (id:number) => {
  const res = await Storage.get({ key: 'books' }) as {value: string};
  try {
    const books = (JSON.parse(res.value) as Book[]).filter(book=>book.id!==id);
    await Storage.set({
      key: 'books',
      value: JSON.stringify(books || []),
    });
  } catch (error) {
    console.error(error);
  }
}

const Tab1: React.FC = () => {
  const [books, setBooks] =  useState<Book[]>([]);
  // @ts-ignore: Unreachable code error
  window.books =  books;
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  useEffect(()=>{
    (async ()=>{
      console.log(await getBooks());
      setBooks(await getBooks());
    })();
  },[]);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <IonInput 
            placeholder="Title"
            type="text"
            value={title}
            onIonChange={(e: any) => setTitle(e.target.value)}
          />
          <IonInput 
            placeholder="Author"
            type="text"
            value={author}
            onIonChange={(e: any) => setAuthor(e.target.value)}
          />
          <IonButton onClick={()=>{
            const newBook: Book = {
              id: Math.ceil(Math.random()*99999),
              title,
              author,
            }
            setBooks([...books, newBook]);
            addBooks([newBook]);
            setAuthor("");
            setTitle("");
          }}>Save</IonButton>
        </IonCard>
        {
          books?.map(({id,title, author})=>{
            return(
              <IonCard>
                <IonTitle>{title}</IonTitle>
                <IonContent>{author}</IonContent>
                <IonButton >
                  <IonIcon icon="trash-outline" onClick={()=>removeBook(id)} />
                </IonButton>
              </IonCard>
            );
          })
        }
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
