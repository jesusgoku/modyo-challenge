import { fetchWithTimeout } from '@app/js/utils';
import testimonials from '@app/js/fixtures/testimonials.json';

/**
 * @typedef {Object} Post
 * @property {string} body - post body
 *
 * @typedef {Object} User
 * @property {number} id - user id
 * @property {string} name - user name
 * @property {Post[]} [posts] - user posts
 *
 * @typedef {Object} Testimonial
 * @property {string} author - testimonial author name
 * @property {string} text - testimonial content
 * @property {string} profilePicture - testimonial author picture
 */

/**
 * Transform JSONPlaceholder users collection to testimonials collection
 *
 * @param {User[]} users - JSONPlaceholder users collection
 *
 * @param {Testimonial[]} - Testimonials collection
 */
function usersToTestimonials(users) {
  return users
    .filter(({ posts }) => !!posts.length)
    .map(({ name: author, posts }, index) => ({
      author,
      text: posts[0].body,
      profilePicture: `/images/person-${index}.jpg`,
    }));
}

/**
 * Attach posts to user from JSONPlaceholder API
 *
 * @param {User} user - user for attach
 * @param {number} [quantity=1] - quantity of post  retrieved
 *
 * @returns {Promise<User>} - user with posts attached
 */
function attachPostsToUser(user, quantity = 1) {
  return new Promise((resolve, reject) => {
    fetchWithTimeout(
      `https://jsonplaceholder.typicode.com/users/${user.id}/posts?_limit=${quantity}`,
      { timeout: 2500 },
    )
      .then((res) => res.json())
      .then((posts) => ({ ...user, posts }))
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Fetch testimonials from JSONPlaceholder API or fallback
 *
 * @returns {Promise<Testimonial[]>} - Testimonials from JSONPlaceholders or fallback
 */
function fetchTestimonials() {
  // For testing only
  // return (new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve(testimonials);
  //     }, 3000);
  //   }))
  //   .then(usersToTestimonials);

  return fetchWithTimeout('https://jsonplaceholder.typicode.com/users?_limit=4', { timeout: 2500 })
    .then((res) => res.json())
    .then((users) => Promise.all(users.map((user) => attachPostsToUser(user))))
    .catch(() => testimonials)
    .then(usersToTestimonials);

  // Load all info in one call, but JSONPlaceholder usually fails
  // return fetchWithTimeout('https://jsonplaceholder.typicode.com/users?_embed=posts&_limit=4', { timeout: 5000 })
  //   .then(res => {
  //     if (res.status >= 300) {
  //       throw new Error('Error: fetching users');
  //     }
  //   })
  //   .then((res) => res.json())
  //   .catch(() => testimonials)
  //   .then(usersToTestimonials)
  // ;
}

export {
  // eslint-disable-next-line import/prefer-default-export
  fetchTestimonials,
};
