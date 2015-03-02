//
//  JobDetailViewController.swift
//  Inturn.io
//
//  Created by Ricky Tran on 3/2/15.
//  Copyright (c) 2015 Parse. All rights reserved.
//

import UIKit
import Parse

class JobDetailViewController: UIViewController {

    @IBOutlet weak var companyLabel: UILabel!
    @IBOutlet weak var positionLabel: UILabel!
    @IBOutlet weak var statusLabel: UILabel!
    @IBOutlet weak var deadlineLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    
    var data: PFObject? {
        didSet {
            refreshUI()
        }
    }
    
    private func refreshUI() {
        if data != nil {
            if let company = data!.objectForKey("company") as? String {
                companyLabel?.text = company
            }
            
            if let position = data!.objectForKey("title") as? String {
                positionLabel?.text = position
            }
            
            if let status = data!.objectForKey("status") as? String {
                statusLabel?.text = status
            }
            
            if let deadline = data!.objectForKey("deadline") as? String {
                deadlineLabel?.text = deadline
            }
            
            if let description = data!.objectForKey("description") as? String {
                descriptionLabel?.text = description
            }
        }

    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        companyLabel?.text = ""
        positionLabel?.text = ""
        statusLabel?.text = ""
        deadlineLabel?.text = ""
        descriptionLabel?.text = ""
        
        refreshUI()
        
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
