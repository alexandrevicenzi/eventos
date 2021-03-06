package br.furb.eventos.dao;

import br.furb.eventos.entity.PersistenseUtil;
import br.furb.eventos.entity.User;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

public class UserDAO {

    private static final UserDAO instance = new UserDAO();

    public static UserDAO getInstance() {
        return instance;
    }

    private UserDAO() {
    }

    public void save(User user) {
        EntityManager em;
        em = PersistenseUtil.getEntityManager();
        EntityTransaction et = em.getTransaction();
        try {
            et.begin();
            if (user.getId() == 0) {
                em.persist(user);
            } else {
                em.merge(user);
            }

            et.commit();
        } catch (Exception e) {
            if (et != null && et.isActive()) {
                et.rollback();
            }
            throw new RuntimeException(e);
        } finally {
            PersistenseUtil.close(em);
        }
    }

    public User getById(long id) {
        User u;

        EntityManager em = PersistenseUtil.getEntityManager();
        u = em.find(User.class, id);
        PersistenseUtil.close(em);

        return u;
    }

    public User getByLogin(String s) {

        EntityManager em = PersistenseUtil.getEntityManager();

        List l = em.createNativeQuery("Select u.* from User u where u.login = ?1", User.class)
                .setParameter(1, s)
                .setMaxResults(1)
                .getResultList();

        if (l.isEmpty()) {
            return null;
        }

        return (User) l.get(0);
    }

    public void remove(User u) {
        EntityManager em = PersistenseUtil.getEntityManager();

        EntityTransaction et = em.getTransaction();

        et.begin();
        em.remove(em.find(User.class, u.getId()));
        et.commit();

        PersistenseUtil.close(em);
    }

    public boolean verify(User u, String toVerify) {

        if (u == null) {
            return false;
        }

        EntityManager em = PersistenseUtil.getEntityManager();

        Query q = null;

        if (null != toVerify) {
            switch (toVerify) {
                case "login":
                    q = em.createQuery("select u from User u where u.login = :login");
                    q.setParameter("login", u.getLogin());
                    break;
                case "email":
                    q = em.createQuery("select u from User u where u.email = :email");
                    q.setParameter("email", u.getEmail());
                    break;
                case "pwd":
                    q = em.createQuery("select u from User u where u.pwd = :pwd");
                    q.setParameter("pwd", u.getPwd());
                    break;
            }
        }

        boolean find = !q.getResultList().isEmpty();
        PersistenseUtil.close(em);

        return find;
    }

    public List<User> getAllUsers() {
        EntityManager em = PersistenseUtil.getEntityManager();
        EntityTransaction et = em.getTransaction();
        List<User> users = null;
        try {
            et.begin();
            TypedQuery<User> query = (TypedQuery<User>) em.createQuery("select u from User u");

            users = query.getResultList();

            for (User u : users) {
                System.out.println("Nome: " + u.getName());
            }

            et.commit();
        } catch (Exception e) {
            if (et != null && et.isActive()) {
                et.rollback();
            }
            throw new RuntimeException(e);
        } finally {
            PersistenseUtil.close(em);
        }
        return users;
    }
}
