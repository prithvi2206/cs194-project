//
//  JobCollectionViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/2/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class JobCollectionViewController: UICollectionViewController {

    var jobs: [PFObject]? {
        didSet {
            if jobs?.count > 0 {
                collectionView.reloadData()
            }
        }
    }
    
    private func fetchJobs() {
        PFQuery(className: "Application").whereKey("userId", equalTo: PFUser.currentUser()).orderByDescending("createdAt").findObjectsInBackgroundWithBlock { (result, error) -> Void in
            if let jobs = result as? [PFObject] {
                self.jobs = jobs
            }
        }
        
    }
    
    private struct Identifiers {
        static let JobCellReuseIdentifier = "Job Cell"
        static let JobDetailSegue = "Job Detail Segue"
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let inset = UIEdgeInsetsMake(20, 0, 0, 0)
        collectionView.contentInset = inset
        
        fetchJobs()

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Register cell classes
        //self.collectionView.registerClass(JobCollectionViewCell.self, forCellWithReuseIdentifier: Identifiers.JobCellReuseIdentifier)

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        switch segue.identifier! {
        case Identifiers.JobDetailSegue:
            if let jobDetailViewController = segue.destinationViewController as? JobDetailViewController {
                if let jobCell = sender as? JobCollectionViewCell {
                    jobDetailViewController.data = jobCell.data
                }
            }
        default:
            break
        }
    }


    // MARK: UICollectionViewDataSource

    override func numberOfSectionsInCollectionView(collectionView: UICollectionView) -> Int {
        //#warning Incomplete method implementation -- Return the number of sections
        return 1
    }


    override func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        //#warning Incomplete method implementation -- Return the number of items in the section
        if jobs == nil {
            return 0
        } else {
            return jobs!.count
        }
    }

    override func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier(Identifiers.JobCellReuseIdentifier, forIndexPath: indexPath) as UICollectionViewCell
        if let jobCell = cell as? JobCollectionViewCell {
            jobCell.data = jobs?[indexPath.row]
            return jobCell
        }
    
        return cell
    }

    // MARK: UICollectionViewDelegate

    /*
    // Uncomment this method to specify if the specified item should be highlighted during tracking
    override func collectionView(collectionView: UICollectionView, shouldHighlightItemAtIndexPath indexPath: NSIndexPath) -> Bool {
        return true
    }
    */

    /*
    // Uncomment this method to specify if the specified item should be selected
    override func collectionView(collectionView: UICollectionView, shouldSelectItemAtIndexPath indexPath: NSIndexPath) -> Bool {
        return true
    }
    */

    /*
    // Uncomment these methods to specify if an action menu should be displayed for the specified item, and react to actions performed on the item
    override func collectionView(collectionView: UICollectionView, shouldShowMenuForItemAtIndexPath indexPath: NSIndexPath) -> Bool {
        return false
    }

    override func collectionView(collectionView: UICollectionView, canPerformAction action: Selector, forItemAtIndexPath indexPath: NSIndexPath, withSender sender: AnyObject?) -> Bool {
        return false
    }

    override func collectionView(collectionView: UICollectionView, performAction action: Selector, forItemAtIndexPath indexPath: NSIndexPath, withSender sender: AnyObject?) {
    
    }
    */

}
